const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'data.json');

class Database {
  constructor() {
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(DB_PATH)) {
        const data = fs.readFileSync(DB_PATH, 'utf8');
        this.data = JSON.parse(data);
      } else {
        this.data = { districts: [], performance: [] };
        this.save();
      }
    } catch (error) {
      console.error('Error loading database:', error);
      this.data = { districts: [], performance: [] };
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_PATH, JSON.stringify(this.data, null, 2));
    } catch (error) {
      console.error('Error saving database:', error);
    }
  }

  getAllDistricts() {
    return this.data.districts.sort((a, b) => 
      a.district_name.localeCompare(b.district_name)
    );
  }

  getDistrict(districtCode) {
    return this.data.districts.find(d => d.district_code === districtCode);
  }

  insertDistrict(district) {
    const exists = this.data.districts.find(
      d => d.state_code === district.state_code && d.district_code === district.district_code
    );
    if (!exists) {
      this.data.districts.push(district);
      this.save();
    }
  }

  getPerformanceData(districtCode, limit = 12) {
    const filtered = this.data.performance.filter(p => p.district_code === districtCode);
    return filtered
      .sort((a, b) => b.month.localeCompare(a.month))
      .slice(0, limit);
  }

  insertPerformanceData(performance) {
    const index = this.data.performance.findIndex(
      p => p.district_code === performance.district_code && p.month === performance.month
    );
    if (index >= 0) {
      this.data.performance[index] = { ...performance, fetched_at: new Date().toISOString() };
    } else {
      this.data.performance.push({ ...performance, fetched_at: new Date().toISOString() });
    }
    this.save();
  }

  getComparisonData(month) {
    const districts = this.data.districts;
    const performance = this.data.performance.filter(p => p.month === month);
    
    return districts.map(d => {
      const perf = performance.find(p => p.district_code === d.district_code);
      return {
        district_name: d.district_name,
        district_code: d.district_code,
        households_employed: perf?.households_employed || 0,
        persondays_generated: perf?.persondays_generated || 0,
        average_days_employment: perf?.average_days_employment || 0,
        works_completed: perf?.works_completed || 0
      };
    }).sort((a, b) => b.persondays_generated - a.persondays_generated);
  }
}

module.exports = new Database();
