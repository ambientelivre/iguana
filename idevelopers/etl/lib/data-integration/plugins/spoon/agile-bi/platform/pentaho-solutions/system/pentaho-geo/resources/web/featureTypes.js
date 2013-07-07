pen.define(function() {
  var local = {
    getFeatureTypes: function() {
      return [
        'Territory',
        'Continent',
        'CountryGroup',
        'Country',
        'CountrySubdivisionGroup',
        'CountrySubdivision',
        'CountrySecondaySubdivisionGroup',
        'CountrySecondaySubdivision',
        'MunicipalityGroup',
        'Municipality',
        'PostalCode',
        'MunicipalitySubdivisionGroup',
        'MunicipalitySubdivision',
        'LocationGroup',
        'Latitude',
        'Longitude',
        'location',
        'Custom'
      ];
    }
  };
  return local;
});

