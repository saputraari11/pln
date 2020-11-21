'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class level extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.hasMany(models.admin, { foreignKey: "id_level", as: "admin" })


        }
    };
    level.init({
        id_level:  {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        nama_level: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'level',
        tableName: "level"
    });
    return level;
};