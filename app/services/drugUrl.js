module.exports = function get_drug_url (drug) {
  const without_slashes= drug.goodrx_name.replace(/ \/ |\//g, '#');
  const lower_case_with_hyphens = without_slashes.toLowerCase().replace(/\s+|#/g, '-');
  const upper_case_with_plus = without_slashes.toUpperCase().replace(/\s+|#/g, '+');
  const hyphenated_dosage = drug.goodrx_dosage.replace('/', '-');

  return `https://www.goodrx.com/${lower_case_with_hyphens}/?` +
    `drug-name=${upper_case_with_plus}&` +
    `form=${drug.goodrx_form}&` +
    `dosage=${hyphenated_dosage}&` +
    `quantity=${drug.goodrx_qty}`;
}