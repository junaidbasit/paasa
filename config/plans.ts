import { PlanMember } from "../types/enums";
const plans = [
    {
        name: PlanMember.COUPLE,
        description: "Couple",
        price: 30,
        member: PlanMember.COUPLE,
        isActive: true
    },
    {
        name: PlanMember.FAMILY_WITH_CHILDREN,
        description: "Family with children",
        price: 50,
        member: PlanMember.FAMILY_WITH_CHILDREN,
        isActive: true
    },
    {
        name: PlanMember.SINGLE_AND_STUDENT,
        description: "Single and student",
        price: 20,
        member: PlanMember.SINGLE_AND_STUDENT,
        isActive: true
    },
    {
        name: PlanMember.LIFETIME_FREE,
        description: "Lifetime free",
        price: 0,
        member: PlanMember.LIFETIME_FREE,
        isActive: true
    },
    {
        name: PlanMember.NEW_ARRIVALS,
        description: "New arrivals",
        price: 0,
        member: PlanMember.NEW_ARRIVALS,
        isActive: true
    },
    {
        name: PlanMember.EXECUTIVE,
        description: "Executive",
        price: 60,
        member: PlanMember.EXECUTIVE,
        isActive: true
    },
]

export default {
    plans
}