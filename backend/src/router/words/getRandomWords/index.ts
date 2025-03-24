import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'

// Функция для перемешивания массива (алгоритм Фишера-Йетса)
const shuffleArray = <T>(array: T[]): T[] => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)) // Случайный индекс от 0 до i
        ;[array[i], array[j]] = [array[j], array[i]] // Меняем местами элементы
    }
    return array
}

export const getRandomWordsFromCollection = async (req: Request, res: Response): Promise<void> => {
    try {
        const prisma = new PrismaClient()
        const collectionId = req.params.id // ID коллекции
        const { count } = req.body
        // const count = parseInt(req.params.count, 10) // Количество слов для выборки

        if (isNaN(count) || count <= 0 || !count) {
            res.status(400).json({ error: 'Invalid count parameter' })
            return
        }

        // Проверяем, существует ли коллекция
        const collection = await prisma.collection.findUnique({
            where: {
                id: collectionId,
            },
        })

        if (!collection) {
            res.status(404).json({ error: 'Collection not found' })
            return
        }

        // Получаем общее количество слов в коллекции
        const totalWordsInCollection = await prisma.word.count({
            where: {
                collectionId: collectionId, // Фильтруем слова по ID коллекции
            },
        })

        if (count > totalWordsInCollection) {
            res.status(400).json({ error: 'Requested count exceeds total number of words in the collection' })
            return
        }

        // Получаем случайные слова из коллекции
        const randomWords = await prisma.word.findMany({
            where: {
                collectionId: collectionId, // Фильтруем слова по ID коллекции
            },
            take: count, // Ограничиваем количество слов
            skip: Math.floor(Math.random() * (totalWordsInCollection - count + 1)), // Пропускаем случайное количество записей
        })

        // Перемешиваем слова перед отправкой
        const shuffledWords = shuffleArray(randomWords)

        res.json(shuffledWords)
    } catch (error) {
        res.status(500).json({ error: `${error}` })
    }
}
