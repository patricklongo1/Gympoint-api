module.exports = {
    dialect: 'postgres', // Verificar documentação do sequelize para dependencias
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'docker',
    database: 'gympoint',
    define: {
        timestamps: true, // createdAt e updatedAt em todas colunas automaticamente.
        underscored: true,
        underscoredAll: true,
    },
};
