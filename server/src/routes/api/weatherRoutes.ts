import { Router, type Request, type Response } from 'express';
import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { city } = req.body;
    if (!city || typeof city !== 'string') {
      return res.status(400).json({ error: 'City name is required and must be a string' });
    }
    const newCity = await HistoryService.addCity(city);
    const weatherData = await WeatherService.getWeatherForCity(city);

   
    const responseArray = Array.isArray(weatherData)
      ? [newCity, ...weatherData]
      : [newCity, weatherData];

    return res.json(responseArray);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to get weather data' });
  }
});

router.get('/history', async (_req: Request, res: Response) => {
  try {
    const cities = await HistoryService.getCities();
    res.json(cities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load search history' });
  }
});

router.delete('/history/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await HistoryService.removeCity(id);
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to remove city' });
  }
});

export default router;
