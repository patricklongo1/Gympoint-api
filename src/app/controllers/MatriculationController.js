import { Op } from 'sequelize';
import * as Yup from 'yup';
import { isAfter, addMonths, parseISO } from 'date-fns';

import Matriculation from '../models/Matriculation';
import Plan from '../models/Plan';
import Student from '../models/Student';

import WellcomeMail from '../jobs/WellcomeMail';
import Queue from '../../lib/Queue';

class MatriculationController {
    async index(req, res) {
        const matriculation = await Matriculation.findAll({
            attributes: [
                'id',
                'student_id',
                'plan_id',
                'start_date',
                'price',
                'active',
            ],
            include: [
                {
                    model: Student,
                    as: 'student',
                    attributes: ['name'],
                },
                {
                    model: Plan,
                    as: 'plan',
                    attributes: ['title'],
                },
            ],
        });
        return res.json(matriculation);
    }

    async show(req, res) {
        const { matriculation_id } = req.params;

        const matriculation = await Matriculation.findOne({
            where: { id: matriculation_id },
            attributes: ['id', 'start_date', 'end_date', 'price'],
            include: [
                {
                    model: Student,
                    as: 'student',
                    attributes: ['id', 'name', 'email'],
                },
                {
                    model: Plan,
                    as: 'plan',
                    attributes: ['id', 'title', 'duration', 'price'],
                },
            ],
        });

        if (!matriculation) {
            return res
                .status(400)
                .json({ error: 'Matriculation does not exists' });
        }

        return res.json(matriculation);
    }

    async store(req, res) {
        const schema = Yup.object().shape({
            student_id: Yup.number().required(),
            plan_id: Yup.number().required(),
            start_date: Yup.date().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        }

        const { student_id, plan_id } = req.body;
        const student = await Student.findOne({
            where: { id: student_id },
        });
        if (!student) {
            return res.status(401).json({ error: 'Student does not exists' });
        }
        const plan = await Plan.findOne({
            where: { id: plan_id },
        });

        if (!plan) {
            return res.status(401).json({ error: 'Plan does not exists' });
        }

        const price = plan.price * plan.duration;

        const { start_date } = req.body;
        const parsedDate = parseISO(start_date);

        const validDate = isAfter(parsedDate, new Date());
        if (!validDate) {
            return res.status(401).json({ error: 'Invalid Date' });
        }
        const endDate = addMonths(parsedDate, plan.duration);

        const matriculation = await Matriculation.create({
            student_id,
            plan_id,
            start_date: parsedDate,
            end_date: endDate,
            price,
        });

        await Queue.add(WellcomeMail.key, {
            student,
            plan,
            parsedDate,
        });

        return res.json(matriculation);
    }

    async update(req, res) {
        const matriculation = await Matriculation.findByPk(req.params.id);
        const { student_id, plan_id, start_date } = req.body;

        if (!matriculation) {
            return res
                .status(400)
                .json({ error: 'Matriculation does not exists' });
        }

        const student = await Student.findByPk(student_id);
        if (!student) {
            return res.status(400).json({ error: 'Student not exists' });
        }

        const plan = await Plan.findByPk(plan_id);
        if (!plan) {
            return res.status(400).json({ error: 'Plan does not exists' });
        }

        const end_date = addMonths(parseISO(start_date), plan.duration);

        await matriculation.update({
            student_id,
            plan_id,
            start_date,
            end_date,
            price: plan.duration * plan.price,
        });

        return res.json(matriculation);
    }

    async destroy(req, res) {
        const { id } = req.params;
        const matriculation = await Matriculation.findByPk(id);

        if (!matriculation) {
            return res.json({ ERROR: 'Matriculation does not exists' });
        }

        await matriculation.destroy();
        return res.json({ message: 'Matriculation was deleted' });
    }
}

export default new MatriculationController();
