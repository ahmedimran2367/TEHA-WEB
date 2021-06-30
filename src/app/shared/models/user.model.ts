// Implementing User
// Account (User) - Contains User or Account level detail
export interface User {
  /** Gets or Sets PK User ID */
  id: number;

  /** Gets or Sets  Name */
  name: string;

  /** Gets or Sets PK User ID */
  masterUserId: number;

  /** Gets or Sets  User Email */
  email: string;

  /** Gets or Sets  Type of User */
  type: string;
  /**
   * Gets or Sets  Teha API Token]
   */
  externalToken: string;

  /** Gets or Sets  Last Login */
  lastLogin: Date | string | null;

  /** Gets or Sets  Token */
  token: string;

  /** Gets or Sets  Refresh Token */
  refreshToken: string;

  /** Gets or sets a value indicating whether password Expired Ind */
  passwordExpiredInd: boolean;
}
