import { ContactMessage } from "./contact.model";
import { Puppy } from "../puppies/puppy.model";
import { NotFoundError } from "../../common/errors/AppError";
export async function create(input: any) {
  if (input.website?.trim()) return { accepted: true };
  const { website, puppyId, ...safe } = input;
  let puppy: any = null;
  if (puppyId) {
    puppy = await Puppy.findOne({
      publicId: puppyId,
      deletedAt: { $exists: false },
    })
      .select("_id publicId")
      .lean();
    if (!puppy) throw new NotFoundError("Selected puppy is not available");
  }
  const d = await ContactMessage.create({
    ...safe,
    puppy: puppy?._id || null,
    puppyPublicId: puppy?.publicId || null,
  });
  return { id: d.id, accepted: true, createdAt: d.createdAt };
}
export async function list(q: any) {
  const { page = 1, limit = 20, status } = q;
  const filter: any = {};
  if (status) filter.status = status;
  const [data, total] = await Promise.all([
    ContactMessage.find(filter)
      .select("-__v")
      .sort({ createdAt: -1, _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    ContactMessage.countDocuments(filter),
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
  const d = await ContactMessage.findById(id).lean();
  if (!d) throw new NotFoundError("Contact message not found");
  return d;
}
export async function update(id: string, status: string) {
  const d = await ContactMessage.findByIdAndUpdate(
    id,
    { $set: { status } },
    { new: true, runValidators: true },
  ).lean();
  if (!d) throw new NotFoundError("Contact message not found");
  return d;
}
