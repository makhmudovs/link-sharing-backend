import Link from "../models/Links";
import User from "../models/User";
import {
  CreateLinkResponse,
  LinkType,
  GetLinksType,
  GetLinksReponse,
  GetLinkReponse,
  UpdateLinkType,
} from "../types";

const createLink = async (content: LinkType): Promise<CreateLinkResponse> => {
  const user = await User.findById(content.user._id);
  if (user) {
    const link = new Link({
      link: content.link,
      owner: user.id,
      platform: content.platform,
    });

    user.links = user.links.concat(link.id);
    try {
      const [linkSaved, userSaved] = await Promise.all([
        link.save(),
        user.save(),
      ]);
      if (linkSaved && userSaved) {
        return { link, err: false, msg: "Link created successfully" };
      } else {
        return { link: {}, err: true, msg: "Cannot save link, internal Error" };
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        return {
          link: {},
          err: true,
          msg: `Cannot crate link, ${error.message}`,
        };
      }
      return { link: {}, err: true, msg: "Cannot create link, internal Error" };
    }
  }
  return { link: {}, err: true, msg: "Cannot create link, internal Error" };
};

const getLinks = async (req: GetLinksType): Promise<GetLinksReponse> => {
  try {
    const links = await Link.find({ owner: req.user._id });
    if (links.length > 0) {
      return { links, err: false, msg: "Fetched successfully" };
    } else {
      return { links: {}, err: true, msg: "No links" };
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        links: {},
        err: true,
        msg: `Cannot get links, ${error.message}`,
      };
    }
    return { links: {}, err: true, msg: "Cannot get links, internal Error" };
  }
};

const getLink = async (id: string): Promise<GetLinkReponse> => {
  try {
    const link = await Link.findById({ _id: id });
    if (link) {
      return { link, err: false, msg: "Fetched successfully" };
    } else {
      return { link: {}, err: true, msg: "No link" };
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { link: {}, err: true, msg: `Cannot get link, ${error.message}` };
    }
    return { link: {}, err: true, msg: "Cannot get link, internal Error" };
  }
};

const updateLink = async (
  linkId: string,
  content: UpdateLinkType
): Promise<GetLinkReponse> => {
  try {
    const { user, ...restContent } = content;
    const link = await Link.findOneAndUpdate({ _id: linkId }, restContent);
    const linkSaved = await link?.save();
    if (linkSaved) {
      return { link: linkSaved, err: false, msg: "Updated successfully" };
    } else {
      return { link: {}, err: true, msg: "No link, cannot update" };
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { link: {}, err: true, msg: `Cannot update ${error.message}` };
    }
    return { link: {}, err: true, msg: "Cannot update, internal Error" };
  }
};

export { createLink, getLinks, getLink, updateLink };
