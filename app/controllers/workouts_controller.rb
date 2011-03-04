class WorkoutsController < ApplicationController
  before_filter :authenticate, :except => [:index, :show]

  rescue_from ActiveRecord::RecordNotFound, :with => :record_not_found

  # GET /workouts
  # GET /workouts.xml
  def index
    @workouts = Workout.all

    respond_to do |format|
      format.html # index.html.erb
      # format.xml  { render :xml => @workouts }
      format.xml  # index.xml.builder
      # format.xml { send_file("#{Rails.root}/app/controllers/allWorkouts.xml",
      #	 { :type => "application/xml" }) }
    end
  end

  # GET /workouts/1
  # GET /workouts/1.xml
  def show
    @workout = Workout.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      #format.xml  { render :xml => @workout.to_xml(:include => [:tags, :comments]) }
      format.xml  # show.xml.builder
    end
  end

  # GET /workouts/new
  # GET /workouts/new.xml
  def new
    @workout = Workout.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @workout }
    end
  end

  # GET /workouts/1/edit
  def edit
    @workout = Workout.find(params[:id])
  end

  # POST /workouts
  # POST /workouts.xml
  def create
    @workout = Workout.new(params[:workout])

    respond_to do |format|
      if @workout.save
        format.html { redirect_to(@workout, :notice => 'Workout was successfully created.') }
        format.xml  { render :xml => @workout, :status => :created, :location => @workout }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @workout.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /workouts/1
  # PUT /workouts/1.xml
  def update
    @workout = Workout.find(params[:id])

    respond_to do |format|
      if @workout.update_attributes(params[:workout])
        format.html { redirect_to(@workout, :notice => 'Workout was successfully updated.') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @workout.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /workouts/1
  # DELETE /workouts/1.xml
  def destroy
    @workout = Workout.find(params[:id])
    @workout.destroy

    respond_to do |format|
      format.html { redirect_to(workouts_url) }
      format.xml  { head :ok }
    end
  end

  private

  def record_not_found
    render :text => "404 Not Found", :content_type => "text/html", :status => 404
  end
end
