from workspace.models import Workspace, WorkspaceUser, Branch
from django.contrib.auth import get_user_model

User = get_user_model()

# Create Workspace
workspace = Workspace.objects.create(
    name="OneAlphaDev",
    street="123 Main St",
    city="Kuwait City",
    country="Kuwait",
    email="esanad@gmail.com",
    email_domain="onealphadev.odoo.com",
)

# Add Branches
branch1 = Branch.objects.create(workspace=workspace, name="Branch 1", address="Branch 1 Address")
branch2 = Branch.objects.create(workspace=workspace, name="Branch 2", address="Branch 2 Address")

# Create Users
user1 = User.objects.create_user(username="manager1", password="password123")
user2 = User.objects.create_user(username="member1", password="password123")

# Assign Users to Workspace
WorkspaceUser.objects.create(workspace=workspace, user=user1, role="manager")
WorkspaceUser.objects.create(workspace=workspace, user=user2, role="member")

# Query Workspace Details
workspace = Workspace.objects.get(name="OneAlphaDev")
print(f"Workspace: {workspace.name}, Email: {workspace.email}, Branches: {[branch.name for branch in workspace.branches.all()]}")
