module.exports = {
    up: QueryInterface => {
        return QueryInterface.bulkInsert(
            'students',
            [
                {
                    name: 'Patrick Longo',
                    email: 'ck.longo@bol.com.br',
                    age: 28,
                    weight: 88,
                    height: 1.8,
                },
                {
                    name: 'Luiza Longo',
                    email: 'luiza@bol.com.br',
                    age: 27,
                    weight: 68,
                    height: 1.65,
                },
                {
                    name: 'Alana Longo',
                    email: 'alana@bol.com.br',
                    age: 25,
                    weight: 58,
                    height: 1.65,
                },
            ],
            {}
        );
    },

    down: () => {},
};
