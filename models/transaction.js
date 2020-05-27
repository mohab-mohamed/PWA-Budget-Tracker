module.exports = function (sequelize, DataTypes) {
	const Transaction = sequelize.define("Transaction", {
		type: DataTypes.STRING,
		amount: {
			type: DataTypes.DECIMAL,
			allowNull: false,
			validate: {
				isNumeric: true,
			},
		},
		note: DataTypes.TEXT,
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW
		}
	});

	// Transaction.associate = function (models) {
	// 	Transaction.belongsTo(models.Budget, {
	// 		foreignKey: {
	// 			allowNull: true,
	// 		},
	// 	});
	// 	Transaction.belongsTo(models.User, {
	// 		foreignKey: {
	// 			allowNull: false,
	// 		},
	// 	});
	// };

	return Transaction;
};
