import Link from "../models/Links";
import User from "../models/User";
import { CreateLinkType, LinkType } from "../types";

const createLink = async (content: LinkType): Promise<CreateLinkType> => {
  const user = await User.findById(content.user._id);
  if (user) {
    const link = new Link({
      link: content.link,
      owner: user.id,
      platform: content.platform,
    });

    user.links = user.links.concat(link.id);
    try {
      await link.save();
      await user.save();
      return { link, err: false, msg: "Link created successfully" };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return { link: {}, err: true, msg: error.message };
      }
      return { link: {}, err: true, msg: "Internal Error" };
    }
  }
  return { link: {}, err: true, msg: "Internal Error" };
};

export { createLink };
