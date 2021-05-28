/**
 * Responsible for
 * - Creating Game,
 * - Updating Score,
 * - Retrieving Scores
 */

const Api = {
  init: (service) => {
    const baseUrl = 'https://us-central1-js-capstone-backend.cloudfunctions.net/api/';
    const idMatcher = 'Game with ID: (.*) added.';
    let scoresUrl;
    let recordSynced = false;
    let records;

    const sortRecords = () => {
      if (!records) {
        return;
      }

      records.sort((a, b) => b.score - a.score);
    };

    const api = () => ({
      records: () => new Promise((resolve, reject) => {
        if (!scoresUrl) {
          setTimeout(() => {
            reject(new Error('Api was not correctly initialized'));
          }, 0);
          return;
        }
        if (recordSynced) {
          setTimeout(() => {
            resolve([...records]);
          }, 0);
          return;
        }

        service.fetch(scoresUrl, { mode: 'cors' })
          .then((response) => {
            if (response.ok) {
              return response.json();
            }
            throw new Error(response.statusText);
          })
          .then((data) => {
            records = data.result;
            recordSynced = true;
            sortRecords();
            resolve([...records]);
          })
          .catch((err) => reject(err));
      }),
      save: (record) => new Promise((resolve, reject) => {
        if (!scoresUrl) {
          reject(new Error('Api was not correctly initialized'));
          return;
        }

        const options = {
          mode: 'cors',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(record),
        };

        service.fetch(scoresUrl, options)
          .then((response) => {
            if (response.ok) {
              return response.json();
            }
            throw new Error('Error making request');
          })
          .then((data) => {
            if (recordSynced) {
              records.push(record);
              sortRecords();
            }
            resolve(data.result);
          })
          .catch((err) => reject(err));
      }),
    });

    return new Promise((resolve, reject) => {
      if (service.gameId) {
        scoresUrl = `${baseUrl}games/${service.gameId}/scores/`;
        setTimeout(() => {
          resolve(api());
        }, 0);
      } else {
        const options = {
          mode: 'cors',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: service.name }),
        };
        service.fetch(`${baseUrl}games/`, options)
          .then((response) => {
            if (response.ok) {
              return response.json();
            }
            throw new Error(response.statusText);
          })
          .then((data) => {
            const [, id] = data.result.match(idMatcher);
            scoresUrl = `${baseUrl}games/${id}/scores/`;
            service.setId(id);
            resolve(api());
          })
          .catch((err) => reject(err));
      }
    });
  },
};

export default Api;
