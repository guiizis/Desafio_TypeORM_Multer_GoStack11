import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}



@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const allTransactions = await this.find()
    const summary = allTransactions.reduce((count, transaction) => {
      if (transaction.type == "income") {
        count.income += Number(transaction.value)
        count.total += Number(transaction.value)
      } else {
        count.outcome += Number(transaction.value)
        count.total -= Number(transaction.value)
      }
      return count
    }, {
      total: 0,
      income: 0,
      outcome: 0
    })

    return summary
  }


}

export default TransactionsRepository;
