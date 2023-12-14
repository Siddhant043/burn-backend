import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    profile: {
      age: {
        type: Number,
        required: [true, 'Age is required'],
      },
      fitnessGoal: {
        type: String,
        required: [true, 'Fitness Goal is required'],
      },
      profilePicture: String,
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
    },
    password: {
      type: String,
      required: [true, 'Password is a required field'],
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Confirm Password is a required field'],
      minlength: 8,
      validate: {
        validator: function (el) {
          return el === this.password;
        },
      },
      message: 'Password and Confirm Password does not match',
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

userSchema.virtual('workouts', {
  ref: 'Workout',
  foreignField: 'user', // this is the key in workout model which we have to refer
  localField: '_id', // this is the key is current model to which we have to refer
});

userSchema.pre(/^find/, function (next) {
  // now 'this' keyword will not point to doc, but it will point to current query
  this.find({ deletedAccount: { $ne: true } });
  next();
});
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function (next) {
  // updating the passwordChangedAt

  if (!this.isModified('password') || this.isNew) {
    return next();
  }
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  // this points to the current query
  //this gives all the users who are active i.e. active != false
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changePasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changeTime = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changeTime; // 100 < 200
  }
  // False means not changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = model('User', userSchema);

export default User;
