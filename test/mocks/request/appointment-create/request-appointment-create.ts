export const requestOKAppointment = {
  insuredId: '00001',
  scheduleId: 5010100,
  countryISO: 'PE',
};

export const invalidRequestAppointmentParamInvalidCountry = {
  insuredId: '00001',
  scheduleId: 5010100,
  countryISO: 'USA',
};

export const invalidRequestAppointmentAllParamInvalid = {
  insuredId: '123',
  scheduleId: 'not a number',
  countryISO: 'US',
};
