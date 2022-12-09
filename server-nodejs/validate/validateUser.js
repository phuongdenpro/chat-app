const commonUtils = require('../utils/commonUtils');
const MyError = require('../exception/MyError');
const User = require('../models/user');
const dateUtils = require('../utils/dateUtils');
const bcrypt = require('bcrypt');

const NAME_INVALID = 'Tên không hợp lệ';
const USERNAME_INVALID = 'Tài khoản không hợp lệ';
const USERNAME_EXISTS_INVALID = 'Tài khoản đã tồn tại';
const PASSWORD_INVALID = 'Mật khẩu không hợp lệ, từ 8 đến 50 kí tự';
const DATE_INVALID = 'Ngày sinh không hợp lệ';
const GENDER_INVALID = 'Giới tính không hợp lệ';
const NAME_REGEX = /\w{1,50}/;

const userValidate = {
     // không được trống, 8 <= size <=50
     validatePassword: (password) => {
        if (!password) return false;
        if (password.length < 8 || password.length > 50) return false;

        return true;
    },
    validateDateOfBirth: (date) => {
        if (!date) return false;

        const { day, month, year } = date;

        if (!day || !month || !year) return false;

        if (year < 1900) return false;

        // check xem có hợp lệ không
        const dateTempt = new Date(`${year}-${month}-${day}`);
        if (dateTempt.toDateString() === 'Invalid Date') return false;

        // check tuổi phải >=10
        const fullyear = dateTempt.getFullYear();
        dateTempt.setFullYear(fullyear + 10);

        if (dateTempt > new Date()) return false;

        return true;
    },
    checkProfile: function (profile) {
        const { name, dateOfBirth, gender } = profile;

        const error = {};

        if (!name || !NAME_REGEX.test(name)) error.name = NAME_INVALID;

        if (!this.validateDateOfBirth(dateOfBirth))
            error.dateOfBirth = DATE_INVALID;

        if (gender !== 0 && gender !== 1) error.gender = GENDER_INVALID;

        if (!commonUtils.isEmpty(error)) throw new MyError(error);

        return {
            name,
            dateOfBirth: dateUtils.toDateFromObject(dateOfBirth),
            gender: new Boolean(gender),
        };
    },
    validateEnterPassword: async function (_id, enterPassword) {
        const { password } = await User.getById(_id);
        const isPasswordMatch = await bcrypt.compare(enterPassword, password);
        if (!isPasswordMatch) throw new MyError('Password wrong');
    },
    validateChangePassword: function (oldPassword, newPassword) {
        if (
            !this.validatePassword(oldPassword) ||
            !this.validatePassword(newPassword) ||
            oldPassword == newPassword
        )
            throw new MyError('Body change password invalid');
    },
};

module.exports = userValidate;
