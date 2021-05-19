import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import { getCustomRepository } from 'typeorm'

import TransactionsRepository from '../repositories/TransactionsRepository'

interface ICreateTransactionServiceProps {
  title: string,
  value: number,
  type: 'income' | 'outcome',
  category: string
}
class CreateTransactionService {
  public async execute({ title, value, type, category }: ICreateTransactionServiceProps): Promise<Transaction> {
    const newTransactionRepository = getCustomRepository(TransactionsRepository)

    const newCreatedTransaction = newTransactionRepository.create({ title, value, type })

    await newTransactionRepository.save(newCreatedTransaction)

    return newCreatedTransaction
  }
}

export default CreateTransactionService;
