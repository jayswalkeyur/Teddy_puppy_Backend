import { Puppy } from "./puppy.model";
import { NotFoundError, ConflictError } from "../../common/errors/AppError";
import slugify from "slugify";
const publicFilter = () => ({
  isPublished: true,
  deletedAt: { $exists: false },
});
const escapeRegex = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
export async function list(query: any, admin = false) {
  const {
    page = 1,
    limit = 12,
    q,
    search,
    breed,
    gender,
    status,
    featured,
    sort = "createdAt",
    order = "desc",
  } = query;
  const filter: any = admin
    ? { deletedAt: { $exists: false } }
    : publicFilter();
  if (breed) filter.breed = new RegExp(`^${escapeRegex(breed)}$`, "i");
  if (gender) filter.gender = gender;
  if (status) filter.status = status;
  if (featured !== undefined) filter.isFeatured = featured;
  const term = q || search;
  if (term) {
    filter.$text = { $search: term };
  }
  const [data, total] = await Promise.all([
    Puppy.find(filter)
      .select(
        "publicId name slug breed gender age status location origin images isFeatured description publishedAt createdAt updatedAt",
      )
      .sort({ [sort]: order === "asc" ? 1 : -1, _id: order === "asc" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Puppy.countDocuments(filter),
  ]);
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    },
  };
}
export async function featured() {
  return Puppy.find({ ...publicFilter(), isFeatured: true })
    .select(
      "publicId name slug breed gender age status location images description",
    )
    .sort({ publishedAt: -1, _id: -1 })
    .limit(12)
    .lean();
}
export async function bySlug(slug: string) {
  const p = await Puppy.findOne({ ...publicFilter(), slug })
    .select("-__v")
    .lean();
  if (!p) throw new NotFoundError("Puppy not found");
  return p;
}
export async function adminById(id: string) {
  const p = await Puppy.findOne({
    _id: id,
    deletedAt: { $exists: false },
  }).lean();
  if (!p) throw new NotFoundError("Puppy not found");
  return p;
}
export async function create(input: any) {
  const data = {
    ...input,
    slug: input.slug || slugify(input.name, { lower: true, strict: true }),
    publishedAt: input.isPublished !== false ? new Date() : undefined,
  };
  try {
    return await Puppy.create(data);
  } catch (e: any) {
    if (e.code === 11000)
      throw new ConflictError("Puppy slug or publicId already exists");
    throw e;
  }
}
export async function update(id: string, input: any) {
  if (input.name && !input.slug)
    input.slug = slugify(input.name, { lower: true, strict: true });
  if (input.isPublished === true) input.publishedAt = new Date();
  const p = await Puppy.findOne({ _id: id, deletedAt: { $exists: false } });
  if (!p) throw new NotFoundError("Puppy not found");
  p.set(input);
  await p.save();
  return p;
}
export async function remove(id: string) {
  const p = await Puppy.findOneAndUpdate(
    { _id: id, deletedAt: { $exists: false } },
    { $set: { deletedAt: new Date(), isPublished: false } },
    { new: true },
  );
  if (!p) throw new NotFoundError("Puppy not found");
  return { id: p.id, deleted: true };
}
