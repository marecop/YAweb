import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

// 用戶文檔接口
export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin';
  memberLevel: number;
  isMember: boolean;
  totalMiles?: number;
  createdAt: Date;
  dateOfBirth?: string;
  phone?: string;
  address?: string;
  country?: string;
  city?: string;
  postalCode?: string;
  comparePassword: (candidatePassword: string) => Promise<boolean>;
}

// 用戶模型接口
interface IUserModel extends Model<IUser> {
  findByEmail: (email: string) => Promise<IUser | null>;
}

// 用戶模式
const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, '請提供電子郵件'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, '請提供有效的電子郵件']
    },
    password: {
      type: String,
      required: [true, '請提供密碼'],
      minlength: [6, '密碼至少需要6個字符']
    },
    firstName: {
      type: String,
      required: [true, '請提供名字'],
      trim: true
    },
    lastName: {
      type: String,
      required: [true, '請提供姓氏'],
      trim: true
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    memberLevel: {
      type: Number,
      default: 1,
      min: 1,
      max: 4
    },
    isMember: {
      type: Boolean,
      default: true
    },
    totalMiles: {
      type: Number,
      default: 0
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    dateOfBirth: String,
    phone: String,
    address: String,
    country: String,
    city: String,
    postalCode: String
  },
  {
    // 啟用虛擬屬性
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// 虛擬屬性：全名
UserSchema.virtual('fullName').get(function (this: IUser) {
  return `${this.firstName} ${this.lastName}`;
});

// 保存前的中間件：加密密碼
UserSchema.pre<IUser>('save', async function (next) {
  // 只有當密碼被修改時才進行加密
  if (!this.isModified('password')) return next();

  try {
    // 生成鹽
    const salt = await bcrypt.genSalt(10);
    // 使用鹽加密密碼
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// 比較密碼方法
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
};

// 通過電子郵件查找用戶的靜態方法
UserSchema.statics.findByEmail = async function (email: string): Promise<IUser | null> {
  return this.findOne({ email });
};

// 創建模型
const UserModel: IUserModel = (mongoose.models.User ||
  mongoose.model<IUser, IUserModel>('User', UserSchema)) as IUserModel;

export default UserModel; 