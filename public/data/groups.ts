const workshops = {
  tav: "ЦТАВ",
  ets: "ЕЦ"
}

const departments = {
  avt: "Автоматика",
  kvp: "КВП",
  rdes: "РДЕС"
}

const groups = {
  ssj1: "ССЖ-1",
  vrt12: "ВРТ-12",
  rdes1: "РДЕС-1",
  rdes2: "РДЕС-2",
}

export const asideGroups = [{
  workshop: workshops.tav,
  departments: [{
    department: departments.avt,
    groups:[groups.ssj1, groups.vrt12]
  },{
    department: departments.kvp,
    groups:[groups.vrt12, groups.vrt12, groups.vrt12]
  }]
},{
  workshop: workshops.ets,
  departments: [{
    department: departments.rdes,
    groups:[groups.rdes1, groups.rdes2]
  }]
}]
