import { getAllTags } from '~/server/data/article';

export default eventHandler(async () => getAllTags());
