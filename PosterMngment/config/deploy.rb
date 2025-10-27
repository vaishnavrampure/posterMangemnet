# Capistrano version
lock "~> 3.19.0"

set :application, "posterMangemnet"
set :repo_url, "https://github.com/vaishnavrampure/posterMangemnet.git"

# EC2 deploy directory
set :deploy_to, "/home/ec2-user/posterMangemnet"

# Deploy branch
set :branch, "main"

# Shared directories (between releases)
append :linked_dirs, "node_modules", "frontend/node_modules"

# Keep last 5 releases
set :keep_releases, 5

# ================================
# Server configuration
# ================================
server "34.204.60.121", user: "ec2-user", roles: %w{app web}

# SSH options (update pem path if different)
set :ssh_options, {
  forward_agent: true,
  auth_methods: %w(publickey),
  keys: %w(~/.ssh/poster_mangement.pem)
}

namespace :npm do
  desc 'Install dependencies and build frontend'
  task :build do
    on roles(:app) do
      within "#{release_path}/PosterMngment" do
        execute :npm, "install --prefix backend"
        execute :npm, "install --prefix frontend"
        execute :npm, "run build --prefix frontend"
      end
    end
  end
end
