import AvailableService from '../services/AvailableService';

class AvailableController {
  async index(req, res) {
    const { date } = req.query;

    if (!date) {
      return req.status(400).json({ error: 'Data inválida' });
    }

    const searchDate = Number(date);

    const availables = await AvailableService.run({
      provider_id: req.params.provider_id,
      date: searchDate,
    });

    return res.json(availables);
  }
}

export default new AvailableController();
