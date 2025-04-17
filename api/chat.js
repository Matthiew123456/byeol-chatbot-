import { Configuration, OpenAIApi } from 'openai';

// Affiche la clé pour diagnostic (ne t’inquiète pas, elle ne s’affiche que dans les logs Vercel)
console.log("🧪 OPENAI_API_KEY:", process.env.OPENAI_API_KEY);

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message manquant dans la requête.' });
  }

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: "Tu es Léa, l'experte skincare de la marque Byeol. Tu donnes des conseils clairs, bienveillants et professionnels aux clients sur les patchs anti-boutons, les délais de livraison, les retours, etc.",
        },
        {
          role: 'user',
          content: message,
        },
      ],
    });

    const response = completion.data.choices[0].message.content;
    res.status(200).json({ response });
  } catch (error) {
    console.error('Erreur OpenAI :', error);
    res.status(500).json({
      error: error.message || 'Erreur lors de l’appel à OpenAI'
    });
  }
}
