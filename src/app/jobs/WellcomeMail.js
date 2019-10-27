import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class WellcomeMail {
    get key() {
        return 'WellcomeMail';
    }

    async handle({ data }) {
        const { student, plan, parsedDate } = data;
        const formatedDate = format(
            parseISO(parsedDate),
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
    }
}

export default new WellcomeMail();
