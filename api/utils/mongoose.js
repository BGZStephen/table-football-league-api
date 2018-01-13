function updateWrap(params) {
  if (!params.updatedDocs) {
    throw new Error('update wrapper requires a new version of the documents for update');
  }

  if (!params.currentDocs) {
    throw new Error('update wrapper requires a current, non-updated version of the documents for update in the event a reversion is required');
  }

  return {
    updatedDocs,
    currentDocs,
    revert: async function () {
      for (const document of this.currentDocs) {
        await document.save();
      }
    },
    save: async function () {
      for (const document of this.updatedDocs) {
        await document.save();
      }
    },
  }
}

module.exports = {
  updateWrap
}
