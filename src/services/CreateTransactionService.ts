import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import { getCustomRepository, getRepository } from 'typeorm'

import TransactionsRepository from '../repositories/TransactionsRepository'
import CategoryRepository from '../models/Category'

interface ICreateTransactionServiceProps {
  title: string,
  value: number,
  type: 'income' | 'outcome',
  category: string
}
class CreateTransactionService {
  public async execute({ title, value, type, category }: ICreateTransactionServiceProps): Promise<Transaction> {
    const newTransactionRepository = getCustomRepository(TransactionsRepository)
    const newCategoryRepository = getRepository(CategoryRepository)

    if (type == "outcome") {
      const { total } = await newTransactionRepository.getBalance()

      if (Number(value) > total) {
        throw new AppError("Not Credits Enough", 400)
      }
    }


    let categoryAlreadyExist = await newCategoryRepository.findOne({ where: { title: category } })

    if (!categoryAlreadyExist) {
      categoryAlreadyExist = newCategoryRepository.create({
        title: category
      })
      await newCategoryRepository.save(categoryAlreadyExist)
    }

    const newCreatedTransaction = newTransactionRepository.create({ title, value, type, category: categoryAlreadyExist })

    await newTransactionRepository.save(newCreatedTransaction)

    return newCreatedTransaction
  }
}

export default CreateTransactionService;
