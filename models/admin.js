'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class admin extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.belongsTo(models.level, { foreignKey: "id_level", as: "level" })
        }
    };
    admin.init({
        id_admin: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        username: DataTypes.STRING,
        password: DataTypes.STRING,
        nama_admin: DataTypes.STRING,
        id_level: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'admin',
        tableName: "admin"
    });
    return admin;
};