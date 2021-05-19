import { getCustomRepository } from 'typeorm';
import { Router } from 'express';


import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const transactionRepositry = getCustomRepository(TransactionsRepository)
  const allTransactions = await transactionRepositry.find()
  const balance = await transactionRepositry.getBalance()

  return response.json({ transactions: allTransactions, balance: balance })
});

transactionsRouter.post('/', async (request, response) => {

  const { title, value, type, category } = request.body

  const newTransactionService = new CreateTransactionService()

  const newTransaction = await newTransactionService.execute({ title, value, type, category })

  response.status(201).json(newTransaction)
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params

  const deleteTransactionService = new DeleteTransactionService()

  await deleteTransactionService.execute({ id })

  return response.status(201).send()

});

transactionsRouter.post('/import', async (request, response) => {

});

export default transactionsRouter;
