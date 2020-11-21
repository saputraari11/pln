'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class penggunaan extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.belongsTo(models.pelanggan, { foreignKey: "id_pelanggan", as: "pelanggan" })
            this.hasOne(models.tagihan, { foreignKey: "id_tagihan", as: "tagihan" })
        }
    };
    penggunaan.init({
        id_penggunaan: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        id_pelanggan: DataTypes.INTEGER,
        bulan: DataTypes.STRING,
        tahun: DataTypes.STRING,
        meter_awal: DataTypes.FLOAT,
        meter_akhir: DataTypes.FLOAT
    }, {
        sequelize,
        modelName: 'penggunaan',
        tableName: "penggunaan"
    });
    return penggunaan;
};