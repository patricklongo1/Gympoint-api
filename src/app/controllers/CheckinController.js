import { startOfWeek, endOfWeek } from 'date-fns';
import { Op } from 'sequelize';

import Checkin from '../models/Checkin';
import Student from '../models/Student';

class CheckinController {
    async index(req, res) {
        const { id } = req.params;

        const student = await Student.findByPk(id);
        if (!student) {
            return res.status(401).json({ error: 'Student does not exists' });
        }

        const checkins = await Checkin.findAll({
            where: { student_id: id },
            attributes: ['id', 'createdAt', 'student_id'],
        });

        return res
            .json(checkins)
            .sort({ createdAt: 'desc' })
            .limit(20);
    }

    async store(req, res) {
        const { id } = req.params;
        const student = await Student.findByPk(id);
        if (!student) {
            return res.status(401).json({ error: 'Student does not exists' });
        }

        const today = new Date();

        const checkinsInPeriod = await Checkin.findAll({
            where: {
                student_id: id,
                created_at: {
                    [Op.between]: [startOfWeek(today), endOfWeek(today)],
                },
            },
        });

        if (checkinsInPeriod.length >= 5) {
            return res
                .status(401)
                .json({ error: 'Student reached weekly check-in limit' });
        }

        await Checkin.create({
            student_id: student.id,
        });

        return res.json(checkinsInPeriod);
    }
}

export default new CheckinController();
