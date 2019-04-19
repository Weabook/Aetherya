from aetherya.models.migrations import Migrate
from aetherya.models.guild import User


@Migrate.only_if(Migrate.non_nullable, User, 'avatar')
def alter_guild_columns(m):
    m.drop_not_nulls(User, User.avatar)
