function (doc) {
	if (!doc.type || doc.type !== 'person') return;

	emit(doc._id, doc);
}