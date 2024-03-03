import { TextServiceClient } from '@google-ai/generativelanguage';
import { GoogleAuth } from 'google-auth-library';
import NewsAPI from 'newsapi';

const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;

const newsapi = new NewsAPI(NEWS_API_KEY);

const MODEL_NAME = 'models/text-bison-001';

const GL_API_KEY = process.env.NEXT_PUBLIC_GL_API_KEY;

const client = new TextServiceClient({
  authClient: new GoogleAuth().fromAPIKey(GL_API_KEY),
});

export default async function handler(req, res) {
  console.log('API got called');

  try {
    const article = await fetchArticle();

    console.log(article, 'article');

    if (article && article?.content) {
      console.log('Article fetched:', article.title);

      const userPrompt = `You are a news editor and content writer. Rewrite the following source news article in 600 words: ${article?.content}`;

      const result = await client.generateText({
        model: MODEL_NAME,
        prompt: {
          text: userPrompt,
        },
      });

      if (
        result &&
        result[0] &&
        result[0].candidates &&
        result[0].candidates[0]
      ) {
        const output = result[0].candidates[0].output;

        const resArticle = {
          title: article.title,
          description: article.description,
          urlToImage: article.urlToImage,
          publishedAt: article.publishedAt,
          content: output,
          source: article,
        };

        console.log('Response article:', resArticle);
        res.status(200).json(resArticle);
      } else {
        res.status(404).json({ error: 'No valid output found' });
      }
    } else {
      res.status(404).json({ error: 'No article content found' });
    }
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
}

async function fetchArticle() {
  try {
    const response = await newsapi.v2.topHeadlines({
      q: '',
      category: 'business',
      language: 'en',
      country: 'us',
    });

    console.log(response?.totalResults, 'totalResults');

    function getRandomArticleWithContent(articles) {
      // Filter articles with non-null content
      const articlesWithContent = articles.filter(
        (article) => article.content !== null
      );

      // If there are articles with content
      if (articlesWithContent.length > 0) {
        // Generate a random index within the range of articles with content
        const randomIndex = Math.floor(
          Math.random() * articlesWithContent.length
        );

        // Return the randomly selected article
        return articlesWithContent[randomIndex];
      } else {
        // If there are no articles with content, return null
        return null;
      }
    }

    const randomArticle = getRandomArticleWithContent(response.articles);

    if (randomArticle && response.articles) {
      return randomArticle;
    }
  } catch (error) {
    console.error('An error occurred while fetching news:', error);
    throw error; // Rethrow the error to be handled by the caller
  }
}
