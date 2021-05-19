import AppError from '../errors/AppError';
import TransactionsRepository from "../repositories/TransactionsRepository"
import { getCustomRepository } from "typeorm"
interface IDeleteTransactionProps {
  id: string
}
class DeleteTransactionService {
  public async execute({ id }: IDeleteTransactionProps): Promise<void> {

    const newTransactionRepositry = getCustomRepository(TransactionsRepository)

    const transactionExist = await newTransactionRepositry.findOne(id)

    if (!transactionExist) {
      throw new AppError("Transaction Not Found")
    }

    await newTransactionRepositry.remove(transactionExist)
  }
}

export default DeleteTransactionService;
