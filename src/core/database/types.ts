export interface GuildPrefixDocument {
  _id: string;
  prefix: string;
}

export interface BannedUserDocument {
  _id: string;
  reason: string | null;
}

export interface BannedGuildDocument {
  _id: string;
  reason: string | null;
}

export interface UserPermissionDocument {
  _id: string;
  permission_level: number;
}

export interface AcceptedTermsDocument {
  _id: string;
  accepted_at: Date;
}
