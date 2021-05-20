import { getRepository, In, getCustomRepository } from 'typeorm'
import TransactionRepository from '../repositories/TransactionsRepository'
import Transaction from '../models/Transaction';
import fs from 'fs'
import csvParser from 'csv-parse'
import categoriesModel from '../models/Category'


interface ICSVTransaction {
  title: string,
  type: 'income' | 'outcome',
  value: number,
  category: string
}
class ImportTransactionsService {
  async execute(filename: string): Promise<Transaction[]> {

    const categoriesRepositories = getRepository(categoriesModel)

    const createReadStream = fs.createReadStream(filename)

    const parsers = csvParser({
      from_line: 2,

    })
    const transactions: ICSVTransaction[] = []
    const categories: string[] = []

    const parseCSV = createReadStream.pipe(parsers)

    parseCSV.on('data', async line => {
      const [title, type, value, category] = line.map((cell: string) => cell.trim())

      if (!title || !type || !value) return

      categories.push(category)
      transactions.push({ title, type, value, category })
    })
    await new Promise(resolve => parseCSV.on('end', resolve))

    const existCategories = await categoriesRepositories.find({
      where: {
        title: In(categories)
      }
    })

    const existCategoriesTitles = existCategories.map(categories => categories.title)

    const addCategoriesTitles = categories.filter(category => !existCategoriesTitles.includes(category))
      .filter((value, index, self) => self.indexOf(value) == index)

    const newCategories = categoriesRepositories.create(
      addCategoriesTitles.map(title => ({
        title,

      }))
    )

    await categoriesRepositories.save(newCategories)

    const finalCategories = [...newCategories, ...existCategories]

    const TransactionsRepositories = getCustomRepository(TransactionRepository)

    const createTransactions = TransactionsRepositories.create(
      transactions.map(transaction => ({
        title: transaction.title,
        type: transaction.type,
        value: transaction.value,
        category: finalCategories.find(category => category.title == transaction.category)

      }))
    )

    await TransactionsRepositories.save(createTransactions)

    await fs.promises.unlink(filename)

    return createTransactions

  }


}

export default ImportTransactionsService;
