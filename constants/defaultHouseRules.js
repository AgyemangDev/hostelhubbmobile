// Standard house rules shown on a listing whose owner has not written
// their own yet. Kept in step with the admin app's presets
// (Hostelhubbdashboard/constants/houseRules.js DEFAULTS).
export const DEFAULT_HOUSE_RULES = {
  "hostel": [
    "Visitors are welcome from 6am to 10pm and must sign in at the porter's lodge.",
    "No overnight guests. Only registered residents sleep in the rooms.",
    "Show your student ID at the gate when asked.",
    "Quiet hours are 10pm to 6am, and all day during exams.",
    "No smoking anywhere on the premises.",
    "No drugs or illegal substances. Offenders are reported to the university and the police.",
    "Cook only in the shared kitchen, never in the bedrooms.",
    "No heating coils, hot plates, rice cookers or gas cylinders in the rooms.",
    "Keep your room and shared spaces clean. Washrooms are cleaned on a rota.",
    "You pay for damage you or your visitors cause beyond normal wear.",
    "Rent is paid in full through HostelHubb before you move in.",
    "Rooms can't be sublet or shared with anyone who isn't a resident.",
    "Move out by the move-out date, leave the room clean and return your keys.",
    "Breaking these rules can lead to a warning, eviction without refund, or a report to your university.",
    "Report faults, leaks and security concerns in the HostelHubb app straight away."
  ],
  "homestel": [
    "Visitors are welcome from 6am to 10pm and must sign in at the porter's lodge.",
    "No overnight guests. Only registered residents sleep in the rooms.",
    "Quiet hours are 10pm to 6am, and all day during exams.",
    "No smoking anywhere on the premises.",
    "Respect other residents and staff. Fighting, bullying or threats lead to eviction.",
    "Cook only in the shared kitchen, never in the bedrooms.",
    "Keep your room and shared spaces clean. Washrooms are cleaned on a rota.",
    "You pay for damage you or your visitors cause beyond normal wear.",
    "Rent is paid in full through HostelHubb before you move in.",
    "Rooms can't be sublet or shared with anyone who isn't a resident.",
    "Move out by the move-out date, leave the room clean and return your keys.",
    "Family areas are private unless you are invited in.",
    "Let the household know if you will be away overnight.",
    "Dress and behave modestly in shared family spaces."
  ],
  "hotel": [
    "Quiet hours are 10pm to 6am, and all day during exams.",
    "No smoking anywhere on the premises.",
    "No drugs or illegal substances. Offenders are reported to the university and the police.",
    "You pay for damage you or your visitors cause beyond normal wear.",
    "Keep valuables locked away. The hostel isn't responsible for items left unattended.",
    "Move out by the move-out date, leave the room clean and return your keys."
  ],
  "guest house": [
    "Visitors are welcome from 6am to 10pm and must sign in at the porter's lodge.",
    "Quiet hours are 10pm to 6am, and all day during exams.",
    "No smoking anywhere on the premises.",
    "No drugs or illegal substances. Offenders are reported to the university and the police.",
    "You pay for damage you or your visitors cause beyond normal wear.",
    "Rent is paid in full through HostelHubb before you move in.",
    "Move out by the move-out date, leave the room clean and return your keys.",
    "Keep valuables locked away. The hostel isn't responsible for items left unattended."
  ],
  "apartment": [
    "Visitors are welcome from 6am to 10pm and must sign in at the porter's lodge.",
    "Quiet hours are 10pm to 6am, and all day during exams.",
    "No smoking anywhere on the premises.",
    "No drugs or illegal substances. Offenders are reported to the university and the police.",
    "You pay for damage you or your visitors cause beyond normal wear.",
    "Rent is paid in full through HostelHubb before you move in.",
    "Move out by the move-out date, leave the room clean and return your keys.",
    "Keep valuables locked away. The hostel isn't responsible for items left unattended."
  ]
};

export const defaultHouseRulesFor = (category) =>
  DEFAULT_HOUSE_RULES[String(category || "hostel").toLowerCase()] || DEFAULT_HOUSE_RULES.hostel;
