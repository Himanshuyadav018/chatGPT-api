import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import pkg from 'openai'

const { Configuration, OpenAIApi} = pkg

dotenv.config()

const configuration = new Configuration({
    apiKey: process.env.OPEN_AI_KEY
})

const openAiApi = new OpenAIApi(configuration)

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
    try{
    res.status(200).send({
        message: 'Hello from Codex Api'
    })
    }catch(err) {
        console.log({message: err.message})
    }
})

app.post('/', async (req, res) => {
    const { prompt } = req.body

    try{
        const response = await openAiApi.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 0,
            max_tokens: 3000,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        })

        res.status(201).send({
            bot: response.data.choices[0].text
        })
    }catch(err) {
        console.log({message: err.message})
    }
})

app.listen(5000, () => console.log('Listening to port http://localhost:5000'))