const REPORT_STATES = [{
    title: "ΚΑΜΙΑ ΕΝΕΡΓΕΙΑ ΕΠΙΣΚΕΥΗΣ",
    default:true,
  },{
    title: "ΠΡΟΣ ΕΠΙΣΚΕΥΗ",
    default: false,
  }, {
    title: "ΕΠΙΣΚΕΥΑΣΤΗΚΕ",
    default: false,
  }]
  
  const DAMAGE_TYPES = [{
    title: "ΕΠΙΚΙΝΔΥΝΗ ΒΛΑΒΗ",
    default:true,
  },
  {
    title:"ΕΝΟΧΛΗΤΙΚΗ ΒΛΑΒΗ",
    default: false
  },
  {
    title: "ΑΙΣΘΗΤΙΚΗ ΒΛΑΒΗ",
    default: false,
  }]


export {REPORT_STATES, DAMAGE_TYPES};