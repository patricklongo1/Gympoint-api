import * as Yup from 'yup';
import { isAfter, addMonths, parseISO, format } from 'date-fns';
import pt from 'date-fns/locale/pt';

import Matriculation from '../models/Matriculation';
import Plan from '../models/Plan';
import Student from '../models/Student';

import Mail from '../../lib/Mail';

class MatriculationController {
    async index(req, res) {
        const matriculation = await Matriculation.findAll({
            attributes: ['id', 'student_id', 'plan_id', 'start_date', 'price'],
        });
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

        const { student_id } = req.body;
        const student = await Student.findOne({
            where: { id: student_id },
        });
        if (!student) {
            return res.status(401).json({ error: 'Student does not exists' });
        }

        const { plan_id } = req.body;
        const plan = await Plan.findOne({
            where: { id: plan_id },
        });
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

        const formatedDate = format(
            parsedDate,
            "'dia' dd 'de' MMMM 'de' yyyy",
            {
                locale: pt,
            }
        );

        await Mail.sendMail({
            to: `${student.name} <${student.email}>`,
            subject: 'Mátricula realizada com sucesso',
            template: 'wellcome',
            context: {
                student: student.name,
                plan: plan.title,
                formatedDate,
            },
        });

        return res.json(matriculation);
    }
}

export default new MatriculationController();
