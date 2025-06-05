import fs from 'node:fs/promises';
import path from 'node:path';
import { v4 as uuidv4 } from 'uuid';


export interface City {
  id: string;
  name: string;
}

class HistoryService {
  private filePath = path.resolve('data/searchHistory.json');

  private async read(): Promise<City[]> {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data) as City[];
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
        return [];
      }
      throw err;
    }
  }

  private async write(cities: City[]): Promise<void> {
    await fs.writeFile(this.filePath, JSON.stringify(cities, null, 2), 'utf-8');
  }

  async getCities(): Promise<City[]> {
    return this.read();
  }

  async addCity(name: string): Promise<City> {
    const cities = await this.read();
    const exists = cities.find(c => c.name.toLowerCase() === name.toLowerCase());
    if (exists) {
      return exists;
    }
    const newCity: City = {
      id: uuidv4(),
      name,
    };
    cities.push(newCity);
    await this.write(cities);
    return newCity;
  }

  async removeCity(id: string): Promise<void> {
    const cities = await this.read();
    const filtered = cities.filter(c => c.id !== id);
    await this.write(filtered);
  }
}

export default new HistoryService();
