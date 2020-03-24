import ScheduleService from '../services/ScheduleService';

class ScheduleController {
  async index(req, res) {
    const { date } = req.query;

    const appointments = await ScheduleService.run({
      user_id: req.user.id,
      date,
    });

    return res.json(appointments);
  }
}

export default new ScheduleController();
