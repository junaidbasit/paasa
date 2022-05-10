import { UserRole } from "./enums";
/**
 * Model User
 * 
 */
export interface User {
  email: string
  isAcceptedTerms: boolean
  password: string
  userRole: UserRole
}
/**
 * Model Profile
 * 
 */
export type Profile = {
  firstName: string
  lastName: string
  phoneNumber: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  zipCode: string
  country: string
  nationality: string
  profession: string
  spouseName: string | null
  spouseEmailAddress: string | null
  numberOfChildren: number | null
  studyingCourse: string | null
  uniCollegeName: string | null
  dateofArrival: Date | null
  bio: string
  whyJoinAsExecutiveMember: string | null
  howWouldYoulikeToServeAsPassaExecutiveMember: string | null
  whatInspiresYouToServeCommunity: string | null
  whatCapacityDoYouWantToServeTheCommunity: string | null
  userId: number
  // profileRole: ProfileRole
}