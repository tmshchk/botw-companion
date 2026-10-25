"use strict";
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {test} = require('node:test');
const source = fs.readFileSync(path.join(__dirname, '../botw_companion/web/app.js'), 'utf8');
function context(locale) {
  const result = vm.createContext({Intl, BOTWI18n: {formatLocale: locale}});
  vm.runInContext(source.slice(source.indexOf('function formatUnit('),
    source.indexOf('const BLOOD_MOON_VISUAL_THRESHOLDS')), result);
  vm.runInContext(source.slice(source.indexOf('function formatDistance('),
    source.indexOf('function toggleRouteItem(')), result);
  return result;
}
test('duration and route distances use the selected language', () => {
  for (const locale of ['fr-FR', 'en-US', 'ru-RU']) {
    const c = context(locale);
    const unit = (value, unit, options = {}) => new Intl.NumberFormat(locale,
      {style: 'unit', unit, unitDisplay: 'short', ...options}).format(value);
    assert.equal(c.bloodMoonDuration(3660), `${unit(1, 'hour')} ${unit(1, 'minute')}`);
    assert.equal(c.bloodMoonDuration(3600), unit(1, 'hour'));
    assert.equal(c.bloodMoonDuration(30), unit(1, 'minute'));
    assert.equal(c.formatDistance(23.7), unit(24, 'meter'));
    assert.equal(c.formatDistance(1234), unit(1.234, 'kilometer',
      {minimumFractionDigits: 2, maximumFractionDigits: 2}));
    assert.equal(c.formatDistance(12000), unit(12, 'kilometer',
      {minimumFractionDigits: 1, maximumFractionDigits: 1}));
  }
});
