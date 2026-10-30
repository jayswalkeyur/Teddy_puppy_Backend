import { Enquiry } from "./enquiry.model";
import { Puppy } from "../puppies/puppy.model";
import { NotFoundError } from "../../common/errors/AppError";
export async function create(input: any) {
  if (input.website?.trim()) return { accepted: true };
  const puppy = await Puppy.findOne({
    publicId: input.puppyId,
    isPublished: true,
    deletedAt: { $exists: false },
  })
    .select("_id publicId name slug")
    .lean();
  if (!puppy) throw new NotFoundError("Selected puppy is not available");
  const { website, ...safe } = input;
  const doc = await Enquiry.create({
    ...safe,
    puppy: puppy._id,
    puppyPublicId: puppy.publicId,
    puppyName: puppy.name,
    puppySlug: puppy.slug,
    source: "puppy-profile",
  });
  return { id: doc.id, accepted: true, createdAt: doc.createdAt };
}
export async function list(q: any) {
  const { page = 1, limit = 20, status, puppyId } = q;
  const filter: any = {};
  if (status) filter.status = status;
  if (puppyId) filter.puppy = puppyId;
  const [data, total] = await Promise.all([
    Enquiry.find(filter)
      .select("-__v")
      .sort({ createdAt: -1, _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Enquiry.countDocuments(filter),
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
export async function get(id: string) {
  const d = await Enquiry.findById(id).lean();
  if (!d) throw new NotFoundError("Enquiry not found");
  return d;
}
export async function update(id: string, status: string) {
  const d = await Enquiry.findByIdAndUpdate(
    id,
    { $set: { status } },
    { new: true, runValidators: true },
  ).lean();
  if (!d) throw new NotFoundError("Enquiry not found");
  return d;
}
