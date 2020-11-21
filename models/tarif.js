'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class tarif extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.hasMany(models.pelanggan, { foreignKey: "id_tarif", as: "pelanggan" })
        }
    };
    tarif.init({
        id_tarif: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        daya: DataTypes.STRING,
        tarifperkwh: DataTypes.FLOAT
    }, {
        sequelize,
        modelName: 'tarif',
        tableName: "tarif"
    });
    return tarif;
};