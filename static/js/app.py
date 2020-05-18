# import necessary libraries

import pandas as pd



from flask import (

    Flask,

    render_template,

    jsonify)







# Flask Setup

app = Flask(__name__)





@app.route("/names")

def names():

    # data load from csv file - pandas

    biodiversity_samples = pd.read_csv('data/belly_button_biodiversity_samples.csv', index_col=0)

    names_list=biodiversity_samples.columns.tolist()

    return jsonify(names_list)



@app.route('/otu')

def otu():

    # data load from csv file - pandas

    biodiversity_otu = pd.read_csv('data/belly_button_biodiversity_otu_id.csv', index_col=0)

    otu_list = biodiversity_otu['lowest_taxonomic_unit_found'].tolist()

    return jsonify(otu_list)



@app.route('/metadata/<id>')

def metadata(id):

    # data load from csv file - pandas

    meta_data = pd.read_csv('data/Belly_Button_Biodiversity_Metadata.csv')

    meta_data = meta_data[['AGE', 'BBTYPE', 'ETHNICITY', 'GENDER', 'LOCATION', 'SAMPLEID']]

    meta_data['ETHNICITY'].fillna(value="Unidentified", inplace=True)

    meta_data['LOCATION'].fillna(value="Unidentified", inplace=True)

    meta_data['GENDER'].fillna(value="Unidentified", inplace=True)

    meta_data['BBTYPE'].fillna(value="Unknown", inplace=True)

    meta_data['AGE'].fillna(value=0, inplace=True)

    meta_data['AGE'].fillna(value=0, inplace=True)

    

    meta_data['ID'] = 'BB_' + meta_data['SAMPLEID'].astype(str)

    meta_data = meta_data.set_index('ID').to_dict('index')

    data = meta_data[id]

    mData = []

    for k,v in data.items():

        kv = {'t0':k, 't1':v}

        mData.append(kv)



    return jsonify(mData)





@app.route('/WFREQval/<id>')

def WFREQval(id):

    import pandas as pd

    WFREQ = pd.read_csv('data/Belly_Button_Biodiversity_Metadata.csv')

    WFREQ = WFREQ[['SAMPLEID', 'WFREQ']]

    WFREQ['WFREQ'].fillna(value=0, inplace=True)

    WFREQ['ID'] = 'BB_' + WFREQ['SAMPLEID'].astype(str)

    WFREQ = WFREQ.drop(['SAMPLEID'], axis=1)

    WFREQ = WFREQ.set_index('ID').to_dict('index')

    WFREQ = WFREQ[id]



    return jsonify(WFREQ)



@app.route('/wfreq/<id>')

def wfreq(id):

    # data load from csv file - pandas

    meta_data = pd.read_csv('data/Belly_Button_Biodiversity_Metadata.csv')

    meta_data = meta_data[['WFREQ', 'SAMPLEID']]

    meta_data['ID'] = 'BB_' + meta_data['SAMPLEID'].astype(str)

    meta_data = meta_data.set_index('ID').drop(['SAMPLEID'], axis=1).to_dict('index')

    return jsonify(int(meta_data[id]['WFREQ']))







@app.route('/samples/<id>')

def samples(id):

    # data load from csv file - pandas

    biodiversity_samples = pd.read_csv('data/belly_button_biodiversity_samples.csv')

    biodiversity_samples = biodiversity_samples[['otu_id',id]].sort_values(id, ascending=0)

    biodiversity_samples.columns = ['otu_id', "sample_values"]

    biodiversity_samplesL = biodiversity_samples[biodiversity_samples['sample_values'] > 10]

    small_vals = biodiversity_samples[biodiversity_samples['sample_values'] < 10]['sample_values'].sum()

    smallD = {'otu_id' : 'Other GERMS', 'sample_values' : small_vals}

    biodiversity_samplesS = pd.DataFrame(smallD, index=[0])

    df = pd.concat([biodiversity_samplesL, biodiversity_samplesS])



    return jsonify(df.to_dict('list'))



@app.route('/samples2/<id>')

def samples2(id):

    # data load from csv file - pandas

    biodiversity_samples = pd.read_csv('data/belly_button_biodiversity_samples.csv')

    biodiversity_samples = biodiversity_samples[['otu_id',id]].sort_values(id, ascending=0)

    biodiversity_samples.columns = ['otu_id', "sample_values"]

    biodiversity_samples = biodiversity_samples.fillna(0)

    biodiversity_samples = biodiversity_samples[biodiversity_samples['sample_values'] > 0 ]



    return jsonify(biodiversity_samples.to_dict('list'))



# for bar stats



@app.route('/samples3/<id>')

def samples3(id):

    # data load from csv file - pandas

    df = pd.read_csv('data/belly_button_biodiversity_samples.csv').drop(['otu_id'], axis=1).T

    df['sum'] = df.sum(axis=1)

    thisSamp=df.loc[id]['sum']

    stats=df['sum'].describe().to_frame()

    stats.loc['median'] = stats.loc['50%']

    stats.loc[id] = thisSamp

    stats.drop(['count', 'std', '50%'], inplace=True)

    stats.sort_values(by=['sum'], ascending=False, inplace=True)

    stats['sum'] = stats['sum'].astype('int')

    stats.reset_index(inplace=True)

    stats.columns = ['label', 'value']





    return jsonify(stats.to_dict('list'))









# create route that renders index.html template

@app.route("/")

def home():

    return render_template("index.html")



if __name__ == "__main__":

    app.run(debug=True)