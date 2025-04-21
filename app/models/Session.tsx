import mongoose, { Schema, Document, Model } from 'mongoose';
import crypto from 'crypto';

// 會話文檔接口
export interface ISession extends Document {
  userId: string;
  token: string;
  expires: Date;
  createdAt: Date;
  lastActive: Date;
  isExpired: () => boolean;
}

// 會話模型接口
interface ISessionModel extends Model<ISession> {
  createSession: (userId: string, expiresAt: Date) => Promise<ISession>;
  findByToken: (token: string) => Promise<ISession | null>;
  cleanExpiredSessions: () => Promise<number>;
}

// 會話模式
const SessionSchema = new Schema<ISession>(
  {
    userId: {
      type: String,
      required: [true, '需要用戶ID'],
      index: true
    },
    token: {
      type: String,
      required: [true, '需要令牌'],
      unique: true,
      index: true
    },
    expires: {
      type: Date,
      required: [true, '需要過期時間']
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    lastActive: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

// 檢查會話是否過期
SessionSchema.methods.isExpired = function (this: ISession): boolean {
  return new Date() > this.expires;
};

// 創建新會話的靜態方法
SessionSchema.statics.createSession = async function (
  userId: string,
  expiresAt: Date
): Promise<ISession> {
  // 生成隨機令牌
  const token = crypto.randomBytes(32).toString('hex');
  
  // 創建並返回新會話
  return this.create({
    userId,
    token,
    expires: expiresAt,
    lastActive: new Date()
  });
};

// 通過令牌查找會話的靜態方法
SessionSchema.statics.findByToken = async function (
  token: string
): Promise<ISession | null> {
  return this.findOne({ token });
};

// 清理過期會話的靜態方法
SessionSchema.statics.cleanExpiredSessions = async function (): Promise<number> {
  const result = await this.deleteMany({ expires: { $lt: new Date() } });
  return result.deletedCount || 0;
};

// 創建模型
const SessionModel: ISessionModel = (mongoose.models.Session ||
  mongoose.model<ISession, ISessionModel>('Session', SessionSchema)) as ISessionModel;

export default SessionModel; 